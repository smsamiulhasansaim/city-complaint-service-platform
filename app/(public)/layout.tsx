export default function PublicLayout({ children }: LayoutProps<"/">) {
  return <div className="min-h-[60vh]">{children}</div>;
}