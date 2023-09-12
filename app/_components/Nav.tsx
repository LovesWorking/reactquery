"use client"
import Link from 'next/link'
import React from 'react'
import {signIn, signOut, useSession} from 'next-auth/react'

type Props = {}


export default function Nav({}: Props) {
    const session = useSession();

    if (!session) {
        return (<h1>Not Authorized</h1>
    )}

  return (
    <div className='bg-blue-500 space-x-3'>
    <Link href="/">Home</Link>
    <Link href="/api/auth/signin">Signin</Link>
    <Link href="/api/auth/Signout">Signout</Link>
    <h1 className='bg-white'>Authorized {session.data?.user?.name}</h1>

    </div>
  )
}