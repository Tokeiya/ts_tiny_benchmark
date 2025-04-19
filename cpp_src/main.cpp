#include <kv/dd.hpp>
#include <limits>
#include <kv/conv-dd.hpp>
typedef kv::dd dd;

int main()
{
    std::cout<<kv::conv_dd::ddtostring(1.0e-15, 0)<<std::endl;
    std::cout<<std::setprecision(17)<<1.0e-15<<std::endl;
}
