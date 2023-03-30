const postTest = async (req, res) => {
  // TODO: Remove console.log
  console.log(req.body);
  return res.status(200).json(req.body);
}

export { postTest };
