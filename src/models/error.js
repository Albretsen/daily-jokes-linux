class DatabaseError extends Error {
  constructor(prismaError) {
    super(prismaError.message);
    this.code = prismaError.code;
    this.details = prismaError.meta;
  }

  isClientError() {
    if (typeof this.code === 'string' && this.code.startsWith("P2")) {
      return true;
    } else {
      return false;
    }
  }
}

export default DatabaseError;
