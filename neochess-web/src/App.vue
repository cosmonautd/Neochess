<template>
<div id="app" class="small-container">
	<!-- <div>
		<img alt="Vue logo" src="./assets/logo.png">
	</div> -->
	<router-view/>
</div>
</template>

<script>
export default {
	name: "App",
	components: {
	},
	data() {
		return {
			url: [],
		}
	},
	methods: {
		async getEmployees() {
			try {
				const res = await fetch('https://jsonplaceholder.typicode.com/users');
				const data = await res.json();
				this.employees = data;
			} catch (error) {
				console.error(error);
			}
		},
		async addEmployee(employee) {
			try {
				const res = await fetch('https://jsonplaceholder.typicode.com/users', {
					method: 'POST',
					body: JSON.stringify(employee),
					headers: { 'Content-type': 'application/json; charset=UTF-8' },
				})
				const data = await res.json()
				this.employees = [...this.employees, data]
			} catch (error) {
				console.error(error)
			}
		},
		async editEmployee(id, updatedEmployee) {
			try {
				const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
					method: 'PUT',
					body: JSON.stringify(updatedEmployee),
					headers: { 'Content-type': 'application/json; charset=UTF-8' },
				})
				const data = await res.json()
				this.employees = this.employees.map(
					employee => (employee.id === id ? data : employee)
				);
			} catch (error) {
				console.error(error)
			}
		},
		async deleteEmployee(id) {
			try {
				await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
					method: "DELETE"
				});
				this.employees = this.employees.filter(employee => employee.id !== id);
			} catch (error) {
				console.error(error);
			}
		}
	},
	mounted() {
		this.getEmployees()
	}
}
</script>

<style>
body {
	color: #ffffff;
	background-color: #1D1D1D;
}
#app {
	margin-top: 2em;
	display: block;
	text-align: center;
	font-family: Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
.align-left {
	text-align: left;
}
.neochess-title {
	font-weight: bold;
}
.center {
  margin: auto;
  width: 50%;
}
</style>