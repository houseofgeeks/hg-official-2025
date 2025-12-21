const CommunityLayout = ({
  children,
  community,
}: {
  children: React.ReactNode;
  community: string;
}) => {
  return (
    <div>
      {children}
      {community}
    </div>
  );
};
export default CommunityLayout;