'use server';

import prisma from "@/lib/prisma";
import { formSchema, formSchemeType } from "@/schemas/form";
import { currentUser } from "@clerk/nextjs/server";

class UserNotFoundError extends Error {
    constructor() {
        super('User not found');
        this.name = 'UserNotFoundError';
    }
}

export async function GetFormStats(){
    const user = await currentUser();
    if( !user) {
        return {
            submissions: 0,
            visits: 0,
            submissionsRate: 0,
            bouncesRate: 0
        };
    }


    const stats = await prisma.form.aggregate({
        where:{
            userId: user.id,
        },
        _sum:{
            visits: true,
            submissions: true
        }
    })

    const visits = stats._sum.visits || 0 
    const submissions = stats._sum.submissions || 0

    const submissionsRate = submissions === 0 ? 0 : Math.floor((submissions / visits) * 100)
    const bouncesRate = 100 - submissionsRate
    return {
        submissions,
        visits,
        submissionsRate,bouncesRate
    }

}

export async function CreateForm(data:formSchemeType){
    const validation = formSchema.safeParse(data);
    if(!validation.success){
        throw new Error(validation.error?.message);
    }
    const user = await currentUser();
    if( !user) {
        throw new UserNotFoundError();

    }

    const form = await prisma.form.create({
        data:{
            userId: user.id,
            name: data.name,
            description: data.description
        }
    })

    if(!form){
        throw new Error("Something went wrong");
    }


    return form.id

}

export async function  GetForms(){
    const User = await currentUser();
    if( !User) {
        throw new UserNotFoundError();
    }

    const forms = await prisma.form.findMany({
        where: {
            userId: User.id
        },orderBy:{
            createdAt: 'desc'
        }
    })

    return forms
}

export async function GetFormById(id: number) {
    const user = await currentUser();
    if( !user) {
        throw new UserNotFoundError();
    }
    return await prisma.form.findUnique({
        where: {
            id,
            userId: user.id
        }
    })
}