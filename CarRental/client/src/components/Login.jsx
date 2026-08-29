import React, { useState } from 'react'

const Login = ({ setShowLogin }) => {

  const [state, setState] = useState("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (state === "login") {
      console.log("Login:", email, password)
      alert("Login Successful (Demo)")
    } else {
      console.log("Signup:", name, email, password)
      alert("Account Created (Demo)")
    }
  }

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed inset-0 z-50 flex items-center justify-center text-sm text-gray-600 bg-black/50"
    >

      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl text-gray-500 border border-gray-200 p-8 py-10 w-80 sm:w-[352px]"
      >

        <p className="text-2xl font-medium text-center">
          <span className="text-primary">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {/* Name (only signup) */}
        {state === "signup" && (
          <div className="mt-4">
            <label className="block">Name</label>
            <input
              type="text"
              placeholder="Enter name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            />
          </div>
        )}

        {/* Email */}
        <div className="mt-4">
          <label className="block">Email</label>
          <input
            type="email"
            placeholder="type here"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
          />
        </div>

        {/* Password */}
        <div className="mt-4">
          <label className="block">Password</label>
          <input
            type="password"
            placeholder="type here"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
          />
        </div>

        {/* Toggle Login/Signup */}
        <p className="mt-4 text-center">
          {state === "login" ? "Create an account?" : "Already have an account?"}
          <span
            onClick={() => setState(state === "login" ? "signup" : "login")}
            className="text-primary cursor-pointer ml-1"
          >
            Click here
          </span>
        </p>

        {/* Button */}
        <button
          type="submit"
          className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md mt-4 cursor-pointer"
        >
          {state === "login" ? "Login" : "Sign Up"}
        </button>

      </form>

    </div>
  )
}

export default Login