const takeTicket = function(ticket) {
	return setTimeout(() => {
		console.log(`ticket with id ${ticket.id} taken`);
		return setTimeout(() => {
			console.log(`Ticket with ${ticket.customer} completed.  Thanks for choosing to fly with Magic Airlines`);
		}, 1000);
	});
}

const activeClerk = "Jonah Hill";

const tickets = [
	{id: 1, customer: "Channing Tatum"},
	{id: 2, customer: "Matt Maconahaney"}
]

console.log(`Welcome to Magic Airlines.  Our active clerk is ${activeClerk}`);

tickets.forEach(takeTicket);