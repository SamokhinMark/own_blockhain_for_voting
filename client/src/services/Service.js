class Service {
		apiBase = 'http://localhost:8000'

		getResource = async (url) => {
				let res = await fetch(url);

				if (!res.ok) {
						throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
				}
				return await res.json();
		}

		postResource = async (url, data) => {
				const body = !data ? undefined : data;
				console.log(body);
				const options = {
						method: "POST",
						headers: {
								'Content-Type': 'application/json'
						},
						body: body
				}
				return fetch(url, options)
					.then(response => {
							if (!response.ok) {
									throw new Error('Network response was not ok');
							}
							return response.json();
					})
					.catch(error => {
							console.error('There was a problem with your fetch operation:', error);
					});
		}

		getChain = async () => {
				return await this.getResource(`${this.apiBase}/chain/`);
		}

		getTxs = async () => {
				return await this.getResource(`${this.apiBase}/txs/`);
		}

		getState = async () => {
				return await this.getResource(`${this.apiBase}/state/`);
		}

		getCountsOfChapters = async () => {
				return await this.getResource(`${this.apiBase}/counts/`);
		}

		getBlock = async (id) => {
				return await this.getResource(`${this.apiBase}/chain/${id}/`);
		}

		login = async (data) => {
				return await this.postResource(`${this.apiBase}/login/`, data);
		}

		createWallet = async () => {
				return await this.getResource(`${this.apiBase}/create-wallet/`);
		}

		sendTransaction = async (data) => {
				console.log(data);
				return await this.postResource(`${this.apiBase}/add-transaction/`, data);
		}

		getVotedAddrs = async () => {
				return await this.getResource(`${this.apiBase}/voted-addrs/`);
		}
}

export default new Service();