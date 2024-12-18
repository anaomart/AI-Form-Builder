"use server";

import prisma from "@/lib/prisma";
import { formSchema, formSchemeType } from "@/schemas/form";
import { currentUser } from "@clerk/nextjs/server";
import { Select } from "@radix-ui/react-select";

class UserNotFoundError extends Error {
  constructor() {
    super("User not found");
    this.name = "UserNotFoundError";
  }
}

export async function GetFormStats() {
  const user = await currentUser();
  if (!user) {
    return {
      submissions: 0,
      visits: 0,
      submissionsRate: 0,
      bouncesRate: 0,
    };
  }

  const stats = await prisma.form.aggregate({
    where: {
      userId: user.id,
    },
    _sum: {
      visits: true,
      submissions: true,
    },
  });

  const visits = stats._sum.visits || 0;
  const submissions = stats._sum.submissions || 0;

  const submissionsRate =
    submissions === 0 ? 0 : Math.floor((submissions / visits) * 100);
  const bouncesRate = 100 - submissionsRate;
  return {
    submissions,
    visits,
    submissionsRate,
    bouncesRate,
  };
}

export async function CreateForm(data: formSchemeType) {
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    throw new Error(validation.error?.message);
  }
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundError();
  }

  const form = await prisma.form.create({
    data: {
      userId: user.id,
      name: data.name,
      description: data.description,
    },
  });

  if (!form) {
    throw new Error("Something went wrong");
  }

  return form.id;
}

export async function GetForms() {
  const User = await currentUser();
  if (!User) {
    throw new UserNotFoundError();
  }

  const forms = await prisma.form.findMany({
    where: {
      userId: User.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return forms;
}

export async function GetFormById(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundError();
  }
  return await prisma.form.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function UpdateFormContent(id: number, content: string) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundError();
  }
  return await prisma.form.update({
    where: {
      id,
      userId: user.id,
    },
    data: {
      content,
    },
  });
}

export async function PublishFormFC(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundError();
  }
  return await prisma.form.update({
    where: {
      id,
      userId: user.id,
    },
    data: {
      published: true,
    },
  });
}

export async function GetFormContentByUrl(formUrl: string) {
  return await prisma.form.update({
    select: {
      content: true,
    },

    data: {
      visits: {
        increment: 1,
      },
    },
    where: {
      shareURL: formUrl,
    },
  });
}


export async function SubmitForm(formUrl: string, content: string) {
    const form = await prisma.form.findUnique({
        where: { shareURL: formUrl },
      });
    if (!form) {
      throw new Error("Content cannot be undefined or empty.");
    }
  
    return await prisma.form.update({
      data: {
        submissions: {
          increment: 1,
        },
        FormSubmissions: {
          create: {
            content: content as string,
        },
        },
      },
      where: {
        shareURL: formUrl,
        published:true
      },
    });
  }

  export async function GetFormWithSubmissions(id: number) {
    const user = await currentUser();
    if(!user) throw new UserNotFoundError();
    return await prisma.form.findUnique({
      where:{
        id,
        userId: user.id,
      },include:{
        FormSubmissions: true
      }

    });

  }