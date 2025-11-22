/**
 * JSend response formatter
 * https://github.com/omniti-labs/jsend
 */

export const success = (data, message = null) => {
  const response = {
    status: 'success',
    data,
  };
  if (message) {
    response.message = message;
  }
  return response;
};

export const fail = (data, message = null) => {
  const response = {
    status: 'fail',
    data,
  };
  if (message) {
    response.message = message;
  }
  return response;
};

export const error = (message, code = null, data = null) => {
  const response = {
    status: 'error',
    message,
  };
  if (code) {
    response.code = code;
  }
  if (data) {
    response.data = data;
  }
  return response;
};




