exports.response=(res,status,code,message,data=null)=>{
    res.status(200).json({
        "status":status,
        "code":code,
        "message":message,
        "data":data
    });
}