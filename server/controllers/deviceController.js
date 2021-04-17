const DeviceModel = require("../models/device");

exports.addDevice = async (req, res) => {
	try {
		let device = await DeviceModel.create(req.body);
		res.status(200).json({ msg: "Device Record Added", device: device });
	} catch (error) {
		res.status(400).json({ msg: "Request to add a new device record failed", error: error });
	}
}

exports.findDeviceById = async (req, res) => {
	const id = req.params.id;
	console.log(typeof id);
	try {
		let device = await DeviceModel.findOne({ device_id: id });
		res.status(200).json({ msg: "Device Record Found", device: device });
	} catch (error) {
		res.status(400).json({ msg: "Request to find a device record by id failed", error: error });
	}
}

exports.findDevicesByFilter = async (req, res) => {

	const { device_ids, countries, companies, page, limit } = req.body;
	try {

		let result = await DeviceModel.aggregate([
			{
				"$match":
					device_ids.length > 0 ?
						{ device_id: { $in: device_ids } }
						: companies.length > 0 ?
							{ company: { $in: companies } }
							: countries.length > 0 ?
								{ country: { $in: countries } } : {}
			},
			{
				"$facet": {
					"data": [
						{ "$skip": ((page - 1) * limit) },
						{ "$limit": limit }
					],
					"count": [
						{
							"$group": {
								"_id": null,
								"count": { "$sum": 1 }
							}
						}
					]
				}
			}
		]);

		// console.log(result[0].data);
		console.log(result[0].count[0].count);
		// let devices = await DeviceModel.find(
		// device_ids.length > 0 ?
		// 	{ device_id: { $in: device_ids } }
		// 	: companies.length > 0 ?
		// 		{ company: { $in: companies } }
		// 		: countries.length > 0 ?
		// 			{ country: { $in: countries } } : {}
		// ).limit(limit).skip((page - 1) * limit);
		// let count = 0;
		// if(page === 1) count = await devices.count(); 
		res.status(200).json({
			msg: "Device Records Found", devices: result[0].data,
			pageCount: Math.ceil((result[0].count[0].count) / (limit * 1))
		});
	} catch (error) {
		res.status(400).json({ msg: "Request to find a device record by id failed", error: error });
	}
}

exports.findCountriesByFilter = async (req, res) => {

	const { device_ids, companies } = req.body
	try {
		let countries = await DeviceModel.distinct("country",
			device_ids.length > 0 ?
				{ device_id: { $in: device_ids } }
				: companies.length > 0 ?
					{ company: { $in: companies } } : {}
		);
		res.status(200).json({ msg: "Countries Found", countries: countries });
	} catch (error) {
		res.status(400).json({ msg: "Request to find countries failed", error: error });
	}
}


exports.findCompaniesByFilter = async (req, res) => {

	const { device_ids, countries } = req.body
	try {
		let companies = await DeviceModel.distinct("company",
			device_ids.length > 0 ?
				{ device_id: { $in: device_ids } }
				: countries.length > 0 ?
					{ country: { $in: countries } } : {}
		);
		res.status(200).json({ msg: "Companies Found", companies: companies });
	} catch (error) {
		res.status(400).json({ msg: "Request to find companies failed", error: error });
	}
}



exports.getAllDevices = async (req, res) => {
	const { limit, page } = JSON.parse(req.params.filters);
	try {
		let devices = await DeviceModel.find().limit(limit * 1).skip((page - 1) * limit);
		let count = 0;
		if (page === 1) count = await DeviceModel.countDocuments();
		res.status(200).json({ msg: "All Device Records Found", devices: devices, pageCount: Math.ceil(count / (limit * 1)) });
	} catch (error) {
		res.status(400).json({ msg: "Request to fetch all device records failed", error: error });
	}
}

exports.updateDevice = async (req, res) => {
	const { country, company, device_id } = req.body;
	try {
		let device = await DeviceModel.findOneAndUpdate({ device_id: device_id }, { company: company, country: country },
			{ new: true });
		res.status(200).json({ msg: "Device Record Updated", device: device });
	} catch (error) {
		res.status(400).json({ msg: "Request to update device record failed", error: error });
	}
}

exports.deleteDeviceById = async (req, res) => {
	const id = req.params.id;
	try {
		await DeviceModel.deleteOne({ device_id: id });
		res.status(200).json({ msg: "Device Record Deleted Successfully" });
	} catch (error) {
		res.status(400).json({ msg: "Request to delete device record failed", error: error });
	}
}




