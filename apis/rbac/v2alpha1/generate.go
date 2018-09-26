//go:generate go install github.com/sensu/sensu-go/vendor/github.com/gogo/protobuf/protoc-gen-gofast
//go:generate go install github.com/sensu/sensu-go/vendor/github.com/golang/protobuf/protoc-gen-go
//go:generate -command protoc protoc --gogo_out=Mgoogle/protobuf/timestamp.proto=github.com/gogo/protobuf/types:. -I=../../../vendor/ -I=./
//go:generate protoc types.proto

package v2alpha1
