import TermsOfUse from '@/components/kebijakan/TermsOfUse';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi - Sipete',
  description: 'This is Next.js Signin Page TailAdmin Dashboard Template',
};

export default function SignIn() {
  return <TermsOfUse />;
}
