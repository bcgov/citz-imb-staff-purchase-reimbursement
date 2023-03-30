// Used to check if API is running. 
export const healthCheck = async (req, res) => {
    return res.status(200).send('/health endpoint reached. API running.');
}
