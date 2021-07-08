// router.post('/catchSpirit', async (req, res, next) => {
//   const { body } = req;
//   if (!validateCatchSpiritRequestBody(body)) {
//     res.status(400).json(invalidRequestBody(body, validateCatchSpiritRequestBody.errors));
//     return;
//   }
//   const { qrId, spiritId } = body;
//   try {
//     const qrModelData = await putSpiritInStorage(Number(qrId), spiritId);

//     const errorResponse = validateQrModelData(qrModelData);

//     if (errorResponse !== null) {
//       res.status(500).json(errorResponse);
//       return;
//     }

//     res.status(200).json(qrModelData);
//   } catch (error) {
//     const message = `${error} ${JSON.stringify(error)}`;
//     logger.error(message, error);
//     const errorResponse: ErrorResponse = { 
//       errorTitle: 'Непредвиденная ошибка',
//       errorSubtitle: message 
//     };
//     res.status(500).json(errorResponse);
//   }
// });
