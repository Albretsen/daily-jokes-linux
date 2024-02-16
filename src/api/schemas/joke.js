export default {
  type: "object",
  properties: {
    userId: { type: "integer" },
    textBody: { type: "string" },
    createTimeStamp: { type: "string", format: "date-time" },
    score: { type: "number" },
  },
  required: ["textBody"],
  additionalProperties: false,
};
