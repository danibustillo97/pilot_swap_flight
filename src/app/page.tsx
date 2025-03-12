import Image from "next/image";
import SwapRequestForm from '../components/forms/SwapRequestForm';

export default function Home() {
  return (
    <div className="py-10 bg-gray-50 min-h-screen">
      <SwapRequestForm />
    </div>
  );


}
