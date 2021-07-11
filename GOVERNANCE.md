# iot-manager Governance Document

In this case, one organization would be a company that has a bunch of controllers and numerous IoT devices to manage. This project is temporarily fitting only for one organization. But it should be extended to more, and better to have a neutral party to be the governor. In the design, all companies should know each other and when a new organization wants to join in, it must get approval from all present organizations on the same channel. Only companies who have the intention to share devices or data need to join the same channel.  

Inside each company, one or more admin users should be able to manage the API server layer and database, for example, registering new devices, registering users, and assigning a controller to a device. However, the admin user has no permission to send commands and only the assigned controller can do it, in order to guarantee the legality of all commands. 

The governor will need to inspect the current status of the system and need to handle the issue reported by the joined organizations. When necessary the governor needs to start a poll, and upgrade the contract if all companies agree. 

All members must not abuse or attack the system and follow their agreements. If a company violates, the governor can poll and remove this organization if two-thirds of organizations agree. 

The initial rules should be created by the governor, and new rules need to get everyone’s approval.
