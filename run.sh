docker buildx build --no-cache --platform linux/amd64 \
	--build-arg DATABASE_URL="$DATABASE_URL" \
	-t europe-west3-docker.pkg.dev/$TF_VAR_project_id/my-repo/heymano:v10 .

docker push europe-west3-docker.pkg.dev/$TF_VAR_project_id/my-repo/heymano:v10
