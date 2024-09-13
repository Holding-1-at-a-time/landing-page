'use client'

import { Button } from "@/components/ui/button"
import { SubmitHandler, useForm } from 'react-hook-form';
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMutation } from 'convex/react'
import { Id } from "../convex/_generated/dataModel";
import React from 'react'
import { api } from "@/convex/_generated/api";
import { toast } from "react-toastify";

type PlanType = 'starter' | 'pro' | 'enterprise';
interface SignUpFormData {
  _id: string;
  userId: string;
  createdAt: number;
  name: string;
  email: string;
  companyName: string;
  businessSize: 'solo' | 'small' | 'medium' | 'large';
  address: string;
  mainChallenge: 'scheduling' | 'customer' | 'analytics' | 'growth';
  plan: PlanType;
  industry: string;
  agreeTerms: boolean;
}

const SignUpForm: React.FC<{ onClose: () => void; selectedPlan?: 'starter' | 'pro' | 'enterprise' | undefined }> = ({
  onClose,
  selectedPlan,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    defaultValues: {
      plan: selectedPlan as 'starter' | 'pro' | 'enterprise'
    }
  })

  const createUser = useMutation(api.users.createUser)

  interface SignUpFormProps {
    onClose: () => void
    selectedPlan?: 'starter' | 'pro' | 'enterprise'
  }

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    try {
      if (!data.name || !data.email || !data.companyName || !data.businessSize || !data.industry || !data.mainChallenge || !data.plan) {
        throw new Error('One or more required fields are missing');
      }

      const plan = data.plan === 'pro' ? 'starter' : data.plan;
      const result = await createUser({
        name: data.name,
        email: data.email,
        companyName: data.companyName,
        businessSize: data.businessSize,
        industry: data.industry,
        mainChallenge: data.mainChallenge,
        plan: plan,
        createdAt: Date.now(),
        agreeTerms: false,
        address: "",
        userId: "" as Id<"users">,
        _id: "" as Id<"signup">
      })
      if (result) {
        toast.success('Sign up successful! Welcome to DetailSync.')
        onClose()
      } else {
        throw new Error('Sign up failed');
      }
    } catch (error) {
      console.error('Sign up error:', error)
      toast.error('An unexpected error occurred. Please try again later.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email')} />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="companyName">Company Name</Label>
        <Input id="companyName" {...register('companyName')} />
        {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName.message}</p>}
      </div>
      <div>
        <Label htmlFor="businessSize">Business Size</Label>
        <Select onValueChange={(value) => register('businessSize').onChange({ target: { value } })}>
          <SelectTrigger>
            <SelectValue placeholder="Select business size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solo">Solo Detailer</SelectItem>
            <SelectItem value="small">Small Team (2-5)</SelectItem>
            <SelectItem value="medium">Medium (6-20)</SelectItem>
            <SelectItem value="large">Large (21+)</SelectItem>
          </SelectContent>
        </Select>
        {errors.businessSize && <p className="text-red-500 text-sm">{errors.businessSize.message}</p>}
      </div>
      <div>
        <Label htmlFor="industry">Industry</Label>
        <Input id="industry" {...register('industry')} />
        {errors.industry && <p className="text-red-500 text-sm">{errors.industry.message}</p>}
      </div>
      <div>
        <Label htmlFor="mainChallenge">Main Challenge</Label>
        <Select onValueChange={(value) => register('mainChallenge').onChange({ target: { value } })}>
          <SelectTrigger>
            <SelectValue placeholder="Select main challenge" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scheduling">Efficient Scheduling</SelectItem>
            <SelectItem value="customer">Customer Management</SelectItem>
            <SelectItem value="analytics">Business Analytics</SelectItem>
            <SelectItem value="growth">Scaling Operations</SelectItem>
          </SelectContent>
        </Select>
        {errors.mainChallenge && <p className="text-red-500 text-sm">{errors.mainChallenge.message}</p>}
      </div>
      <div>
        <Label htmlFor="plan">Selected Plan</Label>
        <Select onValueChange={(value) => register('plan').onChange({ target: { value } })}>
          <SelectTrigger>
            <SelectValue placeholder="Select plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="starter">Starter</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
        {errors.plan && <p className="text-red-500 text-sm">{errors.plan.message}</p>}
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="agreeTerms" {...register('agreeTerms')} />
        <Label htmlFor="agreeTerms">I agree to the terms and conditions</Label>
      </div>
      {errors.agreeTerms && <p className="text-red-500 text-sm">{errors.agreeTerms.message}</p>}
      <Button type="submit" className="w-full bg-[#00AE98] hover:bg-[#009B86]">Sign Up</Button>
    </form>
  )
}