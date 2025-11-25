import { CreateSubject } from "./components/create-subject";
import { MemberOrAdmin } from "@/components/organization/role-guard";

export default function EvalHome() {
  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="w-full max-w-2xl">
        <MemberOrAdmin action="create new analysis">
          <CreateSubject />
        </MemberOrAdmin>
      </div>
    </div>
  );
}
