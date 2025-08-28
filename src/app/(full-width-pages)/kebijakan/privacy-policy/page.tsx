import PrivacyPolicy from '@/components/kebijakan/PrivacyPolicy';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi - Sipete',
  description: 'This is Next.js Signin Page TailAdmin Dashboard Template',
};

export default function SignIn() {
  return <PrivacyPolicy />;
}
