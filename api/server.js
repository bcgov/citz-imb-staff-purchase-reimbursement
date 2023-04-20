import Constants from './constants/Constants.js';
import app from './express.js';

const port = Constants.API_PORT;

app.listen(port, (err) => {
    if (err) console.log(err);
    console.info(`Server started on port ${port}.`);
});
