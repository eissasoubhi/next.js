// The two generated LayoutProps implementations currently disagree on whether
// a default-only parallel route contributes a required prop.
export default function Layout({ panel, sidebar }: any) {
  return (
    <div>
      <div>{sidebar}</div>
      <div>{panel}</div>
    </div>
  )
}
