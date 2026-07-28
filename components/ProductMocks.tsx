/** Product UI mockups for the marketing homepage — illustrative, not live student data. */

export function ProductMocks() {
  return (
    <div className="product-mocks grid gap-4 lg:grid-cols-3">
      <StudentMock />
      <TeacherMock />
      <ParentMock />
    </div>
  );
}

function MockChrome({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="product-mock overflow-hidden border border-[var(--line)] bg-white text-left shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <div className="flex items-center gap-2 border-b border-[var(--line)] bg-[#f8fafc] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <p className="ml-2 text-xs font-medium text-slate-500">{title}</p>
      </div>
      <div className="p-5 text-slate-900">{children}</div>
    </article>
  );
}

function StudentMock() {
  return (
    <MockChrome title="Student Dashboard">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-400">
        Today&apos;s lesson
      </p>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold tracking-tight">Binary Search</p>
          <p className="mt-1 text-sm text-slate-500">L2 · Algorithms</p>
        </div>
        <span className="bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">✓ Done</span>
      </div>
      <div className="mt-5 border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Current mastery</span>
          <span className="font-semibold">83%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden bg-slate-200">
          <div className="h-full w-[83%] bg-[#1f2bd5]" />
        </div>
      </div>
      <div className="mt-4 border border-[#1f2bd5]/20 bg-[#1f2bd5]/[0.04] p-4">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#1f2bd5]">
          AI Coach
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          Why do you think this algorithm is O(log n)?
        </p>
      </div>
    </MockChrome>
  );
}

function TeacherMock() {
  return (
    <MockChrome title="Teacher Dashboard">
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-slate-200 p-3">
          <p className="text-2xl font-semibold tracking-tight">24</p>
          <p className="mt-1 text-xs text-slate-500">students</p>
        </div>
        <div className="border border-slate-200 p-3">
          <p className="text-2xl font-semibold tracking-tight text-amber-700">7</p>
          <p className="mt-1 text-xs text-slate-500">stuck on recursion</p>
        </div>
      </div>
      <div className="mt-4 border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold">AI drafted tomorrow&apos;s lesson</p>
        <p className="mt-1 text-sm text-slate-500">Recursion · base cases · 3 practice prompts</p>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-slate-500">Assignment completion</span>
        <span className="font-semibold">96%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden bg-slate-200">
        <div className="h-full w-[96%] bg-[#1f2bd5]" />
      </div>
    </MockChrome>
  );
}

function ParentMock() {
  return (
    <MockChrome title="Parent Dashboard">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-400">
        Weekly progress
      </p>
      <ul className="mt-4 space-y-3 text-sm">
        <li className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span>Algorithmic thinking</span>
          <span className="font-semibold text-emerald-700">▲</span>
        </li>
        <li className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span>Problem solving</span>
          <span className="font-semibold text-emerald-700">▲</span>
        </li>
        <li className="flex items-center justify-between">
          <span>Attendance</span>
          <span className="font-semibold">100%</span>
        </li>
      </ul>
    </MockChrome>
  );
}
