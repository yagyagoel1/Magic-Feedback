"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import {  useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"
const page = () => {
  const [isSubmitting,setIsSubmitting] = useState(false)
  const {toast} = useToast()
  const router = useRouter()


  //zod
  const form =useForm<z.infer<typeof signInSchema>>({
    resolver:zodResolver(signInSchema),
    defaultValues:{
      identifier:"",
      password : "",
    }
  })

  const onSubmit = async (data:z.infer<typeof signInSchema>)=>{
   
   const reuslt  = await signIn("credentials" ,{
      redirect:false,
      identifier: data.identifier,
      password:  data.password
    }
    )
    if(reuslt?.error)
    {
      if(reuslt.error=="CredentialsSignin")
      {
      toast({
        title: "Login Failed",
        description: "Incorrect username or password",
        variant : "destructive"
      })
    }
      else{
        toast({
          title: "Login Failed",
          description: reuslt.error,
          variant : "destructive"
        })  
    }
    }
    if(reuslt?.url){
      router.replace("/dashboard")
    }

    console.log(reuslt)
  }
  return (
    <div className="flex justify-center items-center min-h-screeen bg-gray-100">
      <div className="w-full  max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join this Message Shop</h1>
          <p className="mb-4">Sign in to start yout anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

         <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email/Username</FormLabel>
              <FormControl>
                <Input placeholder="email or username" {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} 
               />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {
            isSubmitting?(<>
            <Loader2 className="mr-4 h-4 animate-spin"> Please wait</Loader2></>): ("Signup")
          }
        </Button>
          </form>
        </Form>
        <div className="text-center mt-4"><p>Not a Member?{' '}
        <Link href={"/sign-up"} className="text-blue-600 hover:text-blue-800">
          Sign Up</Link>
          </p></div>
      </div>
    </div>
  )
}

export default page