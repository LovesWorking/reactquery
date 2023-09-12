"use client"
import Nav from './_components/Nav'
import { useSession} from 'next-auth/react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
export default  function Home() {
  const [newUser, setNewUser] = useState('')
  const session =  useSession();
  const queryClient = useQueryClient()
const {data, isLoading: usersLoading, error} = useQuery({
  queryKey: ['Users'],
  queryFn:  async () => {
  const response = await fetch('/api/users')
  const data = await response.json()
  return data}
})

const {isLoading:deleteUserLoading, mutate: deleteUserById }= useMutation({
  mutationFn: (id:number) => deleteUser(id),
  onMutate: async (id) => {
    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries(['Users']);
    // Snapshot the previous value
    const previousUsers = queryClient.getQueryData<string[]>(['Users']) || [];

    // Optimistically remove the user
    queryClient.setQueryData(['Users'], previousUsers.filter((user,index) => index !== id));
    // Return a context object with the snapshotted value
    return { previousUsers };
  },
  onSettled:() => {
    queryClient.invalidateQueries(['Users'])
  }
})

const { isLoading: addUserLoading, mutate: addNewUser } = useMutation({
  mutationFn: (newUser: string) => addUser(newUser),
  onMutate: async (newUser) => {
    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries(['Users']);
    // Snapshot the previous value
    const previousUsers = queryClient.getQueryData<string[]>(['Users']) || [];

    // Optimistically add the new user to the list
    queryClient.setQueryData(['Users'], [...previousUsers, {name:newUser}]);
    // Return a context object with the snapshotted value
    return { previousUsers };
  },
    // If the mutation fails,
  // use the context returned from onMutate to roll back
  onError: (err, newUser, context: any) => {
    // Rollback to the previous list of users if the mutation fails
    queryClient.setQueryData(['Users'], context.previousUsers);
  },
    // Always refetch after error or success:
    onSettled: () => {
    queryClient.invalidateQueries(['Users']);
  },
});

if (usersLoading || !data) return <div>Loading...</div>

if (error) return <div>Something went wrong</div>



  return (
   <div>
<Nav/>
<div>
<h3>Add a user</h3>
<input onChange={
  (e)=>{
    setNewUser(e.target.value);
  }
}></input>
<button 
onClick={async ()=>{
  addNewUser(newUser);
}
}
>{addUserLoading? "Adding....":"Add"}</button>
</div>

{data.map((user :{name:string},index:number) => {
  return (<p key={index + user.name}>{user.name} <button onClick={()=>{deleteUserById(index)}}>X</button></p>)
})}
   </div>
  )
}

export async function  addUser(newUser:string){
  const response = await fetch('/api/users',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({name: newUser})
  })
  const data = await response.json()
  console.log(data)
 return(data)
}

export async function  deleteUser(id:number){
  const response = await fetch('/api/users',{
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id:id})
  })
  const data = await response.json()
  console.log(data)
 return(data)
}