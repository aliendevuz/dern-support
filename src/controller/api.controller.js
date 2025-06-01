const random = (req, res) => {
    res.status(200).send({ message: "Hello Random!" });
};

const similar = (req, res) => {
    res.status(200).send({ message: "Hello Similar!" });
};

const allKnowledge = (req, res) => {
    res.status(200).send({ message: "Hello All Knowledge!" });
};

const detailsKnowledge = (req, res) => {
    res.status(200).send({ message: "Hello Details Knowledge!" });
};

module.exports = {
    random,
    similar,
    allKnowledge,
    detailsKnowledge
};
