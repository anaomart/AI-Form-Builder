import { SignUp } from "@clerk/nextjs";

export default function page() {
    return <div className=" w-screen h-screen  lg:h-[80vh] flex justify-center items-center">
    
    
    <SignUp />;
    
        </div>
    
   
}