const cookieOptions = (days = 0, hours = 0, minutes = 0, seconds = 0) => {
  return {
    httpOnly: true,
    sameSite: (process.env.DEV_MODE ? 'Lax' : 'None'),
    secure: (process.env.DEV_MODE ? false : true),
    maxAge: days * (1000 * 60 * 60 * 24) + hours * (1000 * 60 * 60) + minutes * (1000 * 60) + seconds * (1000),
  };
}

export default cookieOptions;