function getQueryParam(param){
 const page =  Math.abs(param.page) || 1;
 const limit = Math.abs(param.limit) || 0;
 const skip = (page-1)* limit;

 return {
    skip,
    limit
 }
};


module.exports = getQueryParam;