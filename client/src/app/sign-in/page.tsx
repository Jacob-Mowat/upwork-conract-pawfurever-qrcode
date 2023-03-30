import { SignIn } from '@clerk/nextjs/app-beta/client';

export default function Page() {
  return (
    <div className="flex h-screen justify-center items-center">
        <div className="text-center">
            <SignIn />
        </div>
    </div>
  );
}