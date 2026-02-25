async function handleLogin(e: React.FormEvent) {
  e.preventDefault()
  setLoading(true)
  setError(null)

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  console.log("LOGIN DATA:", data)
  console.log("LOGIN ERROR:", error)

  if (error) {
    setError(error.message)
    setLoading(false)
    return
  }

  router.push('/dashboard')
  router.refresh()
}
