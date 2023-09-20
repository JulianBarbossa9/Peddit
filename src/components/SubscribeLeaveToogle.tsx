'use client'

import { FC, startTransition } from "react";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { SubcribeToSubpedditPayload } from "@/lib/validators/subpeddit";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface SubscribeLeaveToogleProps {
  subpedditId: string
  subpedditName: string
}

const SubscribeLeaveToogle: FC<SubscribeLeaveToogleProps> = ({ subpedditId, subpedditName }) => {
  
  const isSubscribed = false;
  const { loginToast } = useCustomToast()
  const router = useRouter()

  const { } = useMutation({
    mutationFn: async () => {
      const payload: SubcribeToSubpedditPayload = {
        subpedditId,
      }

      const { data } = await axios.post('api/supeddit/subscribe', payload)
      return data as string
    },

    onError: (err) => {
      if (err instanceof AxiosError){
        if (err.response?.status === 401){
          return loginToast()
        }
      }

      return toast({
        title: "There was a problem",
        description: "Something went wrong, please try again",
        variant: 'destructive'
      })
    }, 
    onSuccess: () => {
      startTransition(() => {
        router.refresh()
      })

      return toast({
        title: 'Subscribed',
        description: `You are now subscribed to p/${ subpedditName }`
      })
    }
  })
  

  return isSubscribed ? (
    <Button className="w-full mt-1 mb-4">Leave Community</Button>
  ) : (
    <Button className="w-full mt-1 mb-4">Join to Post</Button>
  );
};

export default SubscribeLeaveToogle;
