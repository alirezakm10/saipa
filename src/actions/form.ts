"use server";

import { authOptions } from "@/app/helpers/authOptions";
import prisma from "@/lib/prisma";
import { formSchema, formSchemaType } from "@/schemas/form";
import { getServerSession } from "next-auth";
// import { currentUser } from "@clerk/nextjs";

class UserNotFoundErr extends Error {}

export async function GetFormStats() {
  // const user = await currentUser();
  // if (!user) {
  //   throw new UserNotFoundErr();
  // }

  const stats = await prisma.form.aggregate({
    _sum: {
      visits: true,
      submissions: true,
    },
  });

  const visits = stats._sum.visits || 0;
  const submissions = stats._sum.submissions || 0;

  let submissionRate = 0;

  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }

  const bounceRate = 100 - submissionRate;

  return {
    visits,
    submissions,
    submissionRate,
    bounceRate,
  };
}

export async function CreateForm(data: formSchemaType) {
  const session = await getServerSession(authOptions)
  const validation = formSchema.safeParse(data)
  if (!validation.success) {
    throw new Error("form not valid")
  }

  const userId = String(session?.user.user_id)
  const { name, description } = data;

  const form = await prisma.form.create({
    data: {
      userId:userId,
      name,
      description,
    },
  });

  if (!form) {
    throw new Error("something went wrong")
  }

  return form.id;
}

export async function GetForms() {
  

  return await prisma.form.findMany({
    where: {
      userId: '1',
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function GetFormById(id: number) {
 

  return await prisma.form.findUnique({
    where: {
      userId: '1',
      id,
    },
  });
}

export async function UpdateFormContent(id: number, jsonContent: string) {
  

  return await prisma.form.update({
    where: {
      userId: '1',
      id,
    },
    data: {
      content: jsonContent,
    },
  });
}

export async function PublishForm(id: number) {
 
  return await prisma.form.update({
    data: {
      published: true,
    },
    where: {
      userId: '1',
      id,
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
  return await prisma.form.update({
    data: {
      submissions: {
        increment: 1,
      },
      FormSubmissions: {
        create: {
          content,
        },
      },
    },
    where: {
      shareURL: formUrl,
      published: true,
    },
  });
}

export async function GetFormWithSubmissions(id: number) {
 

  return await prisma.form.findUnique({
    where: {
      userId: '1',
      id,
    },
    include: {
      FormSubmissions: true,
    },
  });
}
