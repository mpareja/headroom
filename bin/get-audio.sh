#!/usr/bin/env bash
main() {
	local dir="$1/media"
	mkdir -p $dir
	$(dirname $0)/list-media-items.js $@ | process "$dir" "$dir/failures.json" skip
}

# errors while recovering will go to failures-more.json
# rename that file to failures.json to recover again
recover() {
	local dir="$1/media"
	cat "$dir/failures.json" | process "$dir" "$dir/failures-more.json"
}

process() {
	local dir="$1"
	local failfile="$2"
	while read data; do
		local filename=$(echo "$data" | jq -r '.group.name + " - "  + .pack.name + " - " +  .activity.name + " - " + (.duration | tostring) + "min - " + .id + ".mp3"')
		if [ "$3" = "skip" -a -f "$dir/$filename" ]; then
			echo skipping $filename
			continue
		fi

		local id=$(echo "$data" | jq -r '.id')
		local magic=$(node -e "console.log(require('./lib/magic'))")
		local apiUrl="https://api.prod.$magic.com/content/media-items/$id/make-signed-url?mp3=true"
		local fileUrl=$(curl "$apiUrl" -H "authorization: $HEADROOM_BEARER" | jq -r '.url')
		if [ $? -ne 0 ]; then
			echo "$data" >> "$failfile"
			continue
		fi

		curl "$fileUrl" -o "$dir/$filename"
		if [ $? -ne 0 ]; then
			echo "$data" >> "$failfile"
		fi
	done
}

if [ $1 = "recover" ]; then
	shift
	recover $@
else
	main $@
fi
