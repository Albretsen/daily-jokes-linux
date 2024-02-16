export const GenerateJokeJSON = async (userID, textBody) => {
    return {
        textBody: textBody,
        userId: userID,
        createTimeStamp: new Date(),
    }
}