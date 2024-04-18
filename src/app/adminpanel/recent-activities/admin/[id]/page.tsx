import ActivityLogs from "@/components/adminpanel/recentActivities/ActivityLogs"
const page = ({params} : {params: { id: string }}) => {
  return <ActivityLogs id={params.id} />
}

export default page
