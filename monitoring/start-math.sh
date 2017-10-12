ulimit -n 4096 #Костыль
mkdir results

for site in \
	matematikalegko-comments \
	matematikalegko \
	ege-ok \
	ege-ok-comments \
	dxdy \
	mathprofi-ru \
	nuru-ru \
	ru-math-wikia-com \
	1cov-edu_ru \
	cleverstudents \
	hijos_ru__comments \
	hijos_ru \
	algebraclass_ru \
	forum_exponenta_ru \
	ru_solverbook_com \
	ru_onlinemschool_com \
; do
	nohup ionice -c3 nice -n9 js scripts/$site.js &
done
