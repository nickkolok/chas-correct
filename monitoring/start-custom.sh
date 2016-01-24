ulimit -n 4096 #Костыль
mkdir results
#for script in \
#'abireg abireg-comments bloknot bloknot-voronezh kommersant-vrn kp-daily kp-region m36on moe-online vestivrn-novosti riavrn vrntimes-comments vestivrn-programmy vrntimes'
#do
#	echo  $script
#	ionice -c3 nice -n9 js scripts/$script.js
#done;
#ionice -c3 nice -n9 js scripts/abireg.js
#ionice -c3 nice -n9 js scripts/abireg-comments.js
ionice -c3 nice -n9 js scripts/bloknot.js
ionice -c3 nice -n9 js scripts/bloknot-voronezh.js
ionice -c3 nice -n9 js scripts/kommersant-vrn.js
ionice -c3 nice -n9 js scripts/kp-daily.js
ionice -c3 nice -n9 js scripts/kp-region.js
ionice -c3 nice -n9 js scripts/m36on.js
ionice -c3 nice -n9 js scripts/moe-online.js
ionice -c3 nice -n9 js scripts/vestivrn-novosti.js
ionice -c3 nice -n9 js scripts/riavrn.js
ionice -c3 nice -n9 js scripts/vrntimes-comments.js
ionice -c3 nice -n9 js scripts/vestivrn-programmy.js
ionice -c3 nice -n9 js scripts/vrntimes.js
#ionice -c3 nice -n9 js scripts/.js
