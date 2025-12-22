export default function CommunityLayout({
  children,
  community,
}: {
  children: React.ReactNode
  community: React.ReactNode
}) {
  return (
    <>
      {children}
      {community}
    </>
  )
}