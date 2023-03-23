export const healthCheck = async (req, res) => {
    return res.status(200).send('/health endpoint reached. API running.');
}