'use client'

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from 'convex/react'
import React from 'react'
import { v } from 'convex/values';

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
  plan: 'starter' | 'pro' | 'enterprise';
  industry: string;
  agreeTerms: boolean;
}
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as z from 'zod'
import { api } from '../convex/_generated/api'

const signUpSchema = v.object({
  _id: v.id('signup'),
  userId: v.id('users'),
  createdAt: v.number(),
  name: v.string(),
  email: v.string(),
  companyName: v.string(),
  businessSize: v.union(v.literal('solo'), v.literal('small'), v.literal('medium'), v.literal('large')),
  address: v.string(),
  mainChallenge: v.union(v.literal('scheduling'), v.literal('customer'), v.literal('analytics'), v.literal('growth')),
  plan: v.union(v.literal('starter'), v.literal('enterprise')),
})


interface SignUpFormProps {
  onClose: () => void
  selectedPlan?: string
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onClose, selectedPlan }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    defaultValues: {
      plan: selectedPlan as 'starter' | 'pro' | 'enterprise'
    }
  })

  const createUser = useMutation(api.users.createUser)

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    try {
      await createUser({
        name: data.name,
        email: data.email,
        companyName: data.companyName,
        businessSize: data.businessSize,
        industry: data.industry,
        mainChallenge: data.mainChallenge,
        plan: data.plan,
        _id: data._id,
        userId: data.userId,
        createdAt: 0,
        agreeTerms: false
      })
      toast.success('Sign up successful! Welcome to DetailSync.')
      onClose()
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
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register('password')} />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
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