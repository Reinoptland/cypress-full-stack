import NavigationBar from "@/components/NavigationBar";
export default function Home() {
  return (
    <>
      <NavigationBar />
      <main>
        <h1>This is my homepage</h1>
        <ul>
          <li>
            ✅ We want to create a form that sends a POST request to /login
          </li>
          <li>✅We want to save the token we get back from that request</li>
          <li>✅Use that token to make a GET request to /me</li>
        </ul>
      </main>
    </>
  );
}
