import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <h1>Made by <Link className="underline" href="https://karimmoataz.com/">Karim Moataz</Link>!</h1>
      <p className="text-sm text-gray-400 mx-10 text-center">"Explore the power of AI with our platform! Simply add a domain after the website URL, and our chatbot will provide insightful information and answers related to it. Check my portfolio <Link className="underline" href="https://karimmoataz.com/">here</Link>."</p>
    </div>
  );
}
