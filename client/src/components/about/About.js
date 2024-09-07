import './About.css'

const About = () => {
		return (
			<section className="about">
					<h1 className="title">About</h1>
					<hr/>
					<h2 className="subtitle">Welcome to the About page!</h2>
					<p className="text">
							My name is Samokhin Mark, and I am a student at the Kharkiv National University of Radio Electronics.
							This project is my final work for completing my Bachelor's degree.
					</p>

					<div className="subtitle">Project Overview</div>
					<p className="text">
							For my thesis, I developed a blockchain system using TypeScript. In addition to the core blockchain
							implementation, I also created a blockchain explorer website. This explorer allows users to view and
							interact with the blockchain in a user-friendly manner.
					</p>

					<div className="subtitle">Technologies Used</div>
					<p className="text">The project was built using a combination of modern technologies:</p>
					<ul>
							<li className="text">TypeScript: The core blockchain logic is implemented in TypeScript, providing strong
									typing and robust development features.
							</li>
							<li className="text">JavaScript: Used for web-client functionalities throughout the project.
							</li>
							<li className="text">React: The front-end framework used to build the user interface for the blockchain
									explorer.
							</li>
							<li className="text">libp2p: Library utilized for peer-to-peer networking, enabling decentralized
									communication between nodes in the blockchain network.
							</li>
					</ul>

					<div className="subtitle">Project Goals and Features</div>
					<p className="text">
							The primary goal of this project was to apply theoretical knowledge in a practical, real-world scenario.
							The blockchain and explorer include the following features:
					</p>
					<ul>
							<li className="text">
									Blockchain Implementation: A fully functional blockchain with features such as block creation,
									transaction handling, synchronization and validation.
							</li>
							<li className="text">
									Blockchain Explorer: A web-based interface allowing users to explore the blockchain,
									view transactions, and analyze blocks.
							</li>
							<li className="text">
									Peer-to-Peer Networking: Decentralized communication using libp2p, ensuring a distributed
									and resilient network.
							</li>
					</ul>

					<div className="subtitle">Future Prospects</div>
					<p className="text">Moving forward, I am excited about the potential to expand this project further.
							Possible future developments include:</p>
					<ul>
							<li className="text">
									Make blockchain accessible to everyone, move the system from a local to a global state.
							</li>
							<li className="text">
									Implementing advanced cryptographic techniques to improve blockchain security.
							</li>
							<li className="text">
									Adding new features to the explorer, such as analytics and real-time updates.
							</li>
					</ul>

					<div className="subtitle">Personal Reflection</div>
					<p className="text">
							Working on this project has been an incredible learning experience. It allowed me to deepen my
							understanding of blockchain technology. Through the development process,
							I gained valuable insights into TypeScript, React, and the intricacies of peer-to-peer networking with
							libp2p.
					</p>
			</section>
		);
}

export default About;