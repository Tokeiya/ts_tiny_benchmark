#include <kv/dd.hpp>
#include <limits>
typedef kv::dd dd;

int main()
{
    auto x = dd(1.);
    auto y = dd(std::numeric_limits<double>::quiet_NaN());

    auto z = x / y;

    std::cout<<z.a1<<std::endl;
    std::cout<<z.a2<<std::endl;
}
