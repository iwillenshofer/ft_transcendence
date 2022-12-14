<p align="center">
	<img width="130px;" src="https://raw.githubusercontent.com/iwillenshofer/resources/main/images/42_logo_black.svg" align="center" alt="42" />&nbsp;&nbsp;&nbsp;
	<img width="130px" src="https://raw.githubusercontent.com/iwillenshofer/resources/main/achievements/ft_transcendence.png" align="center" alt="ft_transcendence" />
	<h1 align="center">ft_transcendence</h1>
</p>
<p align="center">
	<img src="https://img.shields.io/badge/Success-100/100_✓-gray.svg?colorA=61c265&colorB=4CAF50&style=for-the-badge">
	<img src="https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black">
	<img src="https://img.shields.io/badge/mac%20os-000000?style=for-the-badge&logo=apple&logoColor=white">
</p>

<p align="center">
	<b><i>Development repository for the 42cursus ft_transcendence project @ 42 São Paulo</i></b><br>
</p>

<p align="center">
	<img alt="GitHub code size in bytes" src="https://img.shields.io/github/languages/code-size/iwillenshofer/ft_transcendence?color=blueviolet" />
	<img alt="GitHub top language" src="https://img.shields.io/github/languages/top/iwillenshofer/ft_transcendence?color=blue" />
	<img alt="GitHub top language" src="https://img.shields.io/github/commit-activity/t/iwillenshofer/ft_transcendence?color=brightgreen" />
	<img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/iwillenshofer/ft_transcendence?color=brightgreen" />
</p>
<br>

> _This project is about creating a website for the mighty Pong contest!_



<br>

<p align="center">
	<table>
		<tr>
			<td><b>Est. Time</b></td>
			<td><b>Skills</b></td>
			<td><b>Difficulty</b></td>
		</tr>
		<tr>
			<td valign="top">245 hours</td>
			<td valign="top">
<img src="https://img.shields.io/badge/Web-555">
<img src="https://img.shields.io/badge/Group & interpersonal-555">
<img src="https://img.shields.io/badge/Rigor-555">
			</td>
			<td valign="top"> 24360 XP</td>
		</tr>
	</table>
</p>

<br>

### Stack Used
![Stack Used](https://skillicons.dev/icons?i=postgres,nestjs,angular,docker&theme=light)


### Requirements
```bash
./variables.env #example below
docker
docker-compose
```

### Usage
```bash
$ docker-compose up --build
```

#### variables.env
```bash
#AUTH
CLIENT_ID=[INTRA CLIENT ID]
CLIENT_SECRET=[INTRA CLIENT SECRET]
BASE_URL=https://api.intra.42.fr

#POSTGRES
#Default values can be used
POSTGRES_URL=postgres:5432
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=[ POSTGRESS PASSWORD (defaults to 'postgres') ]
POSTGRES_DB=postgres
PGDATA=/data/postgres
TZ=GMT

#JWT_SECRET
JWT_SECRET=[ RANDOM 32 BYTES ]
JWT_REFRESH_SECRET=[ RANDOM 32 BYTES ]

#crypto cypher
CRYPTO_VECTOR=[ 16 RANDOM BYTES ]
CRYPTO_SECURITY=[ RANDOM 32 BYTES ]
```