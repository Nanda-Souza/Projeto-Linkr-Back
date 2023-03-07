// auth controller

export default function signUp(req, res) {
  const { name, email, img_url, password } = res.locals.signUp;
  try {
    return res.sendStatus(201);
  } catch (error) {
    return res.sendStatus(500);
  }
}
