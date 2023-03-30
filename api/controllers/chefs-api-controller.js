const postTest = async (req, res) => {
  console.log(req.body);
  return res.status(200).json(req.body);
}

export { postTest };
