import { Component, OnInit } from '@angular/core'
import { select, State, Store } from '@ngrx/store'
import {
  BehaviorSubject,
  concat,
  forkJoin,
  from,
  fromEvent,
  interval,
  merge,
  Observable,
  of,
  race,
  range,
  ReplaySubject,
  Subject,
  Subscription,
  throwError,
  timer,
  zip,
} from 'rxjs'
import {
  concatAll,
  concatMap,
  debounceTime,
  delay,
  delayWhen,
  distinctUntilChanged,
  every,
  filter,
  first,
  groupBy,
  last,
  map,
  mapTo,
  mergeAll,
  mergeMap,
  pluck,
  retry,
  startWith,
  switchMap,
  take,
  tap,
  throttleTime,
  toArray,
} from 'rxjs/operators'
import { AppState } from 'src/app/store'
import { decrement, decrement_num, increment, increment_async, increment_num } from 'src/app/store/actions/counter.actions'
import { CounterState } from 'src/app/store/reducers/counter.reducer'
import { selectCount } from 'src/app/store/selectors/counter.selectors'
import { selectQueryParams, selectRouteParam, selectRouteParams } from 'src/app/store/selectors/router.selector'

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.less'],
})
export class TestComponent implements OnInit {
  constructor(private store: Store<AppState>) {}
  counter: Observable<number>
  obMsg = new Date()
  sub: Subscription = null
  ob: Observable<any> = null
  ngOnInit() {
    // 操作符来处理
    // this.counter = this.store.pipe(
    //   select<AppState, 'counter'>('counter'),
    //   map(v => v.count),
    // )
    // 内置方法处理
    this.counter = this.store.pipe(select(selectCount))
    this.store.pipe(select(selectQueryParams)).subscribe(item => console.log(item))

    // this.loadData()
    // this.subjectSub()
    // this.behaviorSub()
    // this.replaySub()
    // this.helperMethods()
    this.operator()
  }

  isTrue
  // 测试模板
  toggle() {
    this.isTrue = !this.isTrue
  }
  // ----observable

  loadData() {
    this.ob = new Observable(data => {
      let i = 0
      let timer = setInterval(() => {
        console.log(new Date())
        i++
        if (i > 5) {
          clearInterval(timer)
          data.complete()
        }
        data.next(new Date())
      }, 1000)

      console.log('开始执行', data)
    })
  }
  subscription() {
    let observers = {
      next: val => {
        this.obMsg = val
      },
      complete: () => {
        console.log('消息没有了')
      },
    }
    this.sub = this.ob.subscribe(observers)
  }
  unsub() {
    this.sub.unsubscribe()
  }

  subjectSub() {
    const demoSubject = new Subject()
    // 不会执行
    demoSubject.subscribe({
      next: function (value) {
        console.log(value)
      },
    })
    demoSubject.subscribe({
      next: function (value) {
        console.log(value)
      },
    })
    // 3s会执行
    setTimeout(function () {
      demoSubject.next('hahaha')
    }, 3000)
  }

  behaviorSub() {
    const demoBehavior = new BehaviorSubject('默认值')

    demoBehavior.subscribe({
      next: function (value) {
        console.log(value)
      },
    })

    demoBehavior.next('Hello')
  }

  replaySub() {
    const rSubject = new ReplaySubject()
    rSubject.subscribe(value => {
      console.log(value)
    })
    rSubject.next('Hello 1')
    rSubject.next('Hello 2')
    setTimeout(function () {
      rSubject.subscribe({
        next: function (value) {
          console.log(value)
        },
        complete: () => {
          console.log('complete')
        },
      })
    }, 3000)
  }

  helperMethods() {
    // range(1, 5).subscribe({ next: v => console.log(v) })
    // 被订阅后会发出指定范围的数值。
    // range(1, 5).subscribe(
    //   v => console.log(v),
    //   err => console.log(err),
    //   () => console.log('complete')
    // )
    // of  将参数列表作为数据流返回。
    // of(1, [1], '2', 'jty').subscribe(v => console.log(v))
    // from 将 Array，Promise, Iterator 转换为 observable 对象。
    // from([1, 2, 3]).subscribe(v => console.log(v))
    // from(
    //   new Promise(resolve => {
    //     setTimeout(() => {
    //       resolve('123')
    //     }, 5000)
    //   })
    // ).subscribe(v => console.log(v))
    // 每过段时间发送一次
    // interval(1000).subscribe(v => console.log(v))
    // 第一次是需要间隔时间才能执行的
    // setInterval(() => {
    //   console.log('第一次执行吗')
    // }, 3000)
    // 第一次也能执行
    // timer(0, 3000).subscribe(v => console.log(v))
    // 只执行一次
    // timer(3000).subscribe(v => console.log(v))
    // concat 将两个流连接起来
    // concat(of(1, 2, 3), of(4, 5, 6)).subscribe(v => console.log(v))
    // merge 按时间顺序将两个流交叉合并
    // const clicks = fromEvent(document, 'click')
    // const timer = interval(1000)
    // merge(clicks, timer).subscribe(console.log)
    // zip
    let age = of(27, 25, 29)
    let name = of('Foo', 'Bar', 'Beer')
    let isDev = of(true, true, false)
    zip(name, age, isDev)
      .pipe(map(([name, age, isDev]) => ({ name, age, isDev })))
      .subscribe(
        v => console.log(v),
        null,
        () => console.log('over')
      )
    //forkJoin   == promise.all
    // forkJoin([from(fetch('http://localhost:3005/goods')), from(fetch('http://localhost:3005/category'))]).subscribe(console.log)
    // race  == promise.race
    const obs1 = timer(1000).pipe(mapTo('fast one'))
    const obs2 = timer(3000).pipe(mapTo('medium one'))
    const obs3 = timer(5000).pipe(mapTo('slow one'))
    race(obs3, obs1, obs2).subscribe(console.log)
    // retry  如果observable出错就会 重新订阅(效果是interval执行了三次0,1,2)
    interval(1000)
      .pipe(
        mergeMap(val => {
          if (val > 2) {
            return throwError('Error!')
          }
          return of(val)
        }),
        retry(2)
      )
      .subscribe({ next: console.log, error: console.log })
    // fromEvent   把事件编程Observable
    const btn = document.getElementById('btn')
    fromEvent(btn || document, 'click').subscribe(e => console.log(e))
  }
  operator() {
    // map 常规map
    // mapTo 不关心原来的值，直接返回给定的值
    // filter 常规过滤
    // of(1, 2, 3)
    //   .pipe(map(v => v * 10))
    //   .pipe(map(v => v + 1))
    //   .pipe(filter(v => v % 2 === 0))
    //   // .pipe(mapTo('成功'))
    //   .subscribe(console.log)
    // pluck 摘去对象中的属性值
    // from([{ name: '张三' }, { a: { b: 3 } }])
    //   // .pipe(pluck('name'))
    //   .pipe(pluck('a', 'b'))
    //   .subscribe(console.log)
    // first first+find的结合，找到了就终止了
    // interval(1000)
    //   .pipe(mapTo([1, 2, 3]), first())
    //   .subscribe(console.log)
    // startWith 给数据源前面+一个默认值
    // of(100, 200, 300)
    // interval(1000)
    //   .pipe(
    //     map(v => v + 100),
    //     startWith(666),
    //     tap(console.log),
    //     first(v => v === 105)
    //   )
    //   .subscribe(console.log)
    // every
    // range(1, 5)
    //   .pipe(every(v => v > 5))
    //   .subscribe(console.log)
    // delay、
    // delayWhen : 对上一环节的操作进行延迟，上一环节发出多少数据流，传入的回调函数就会执行多次。
    // from([1, 2, 3])
    //   .pipe(
    //     tap(v => console.log('延时1s')),
    //     delay(1000),
    //     tap(v => console.log('再延时1s')),
    //     delay(1000),
    //     map(v => v * 10)
    //   )
    //   .subscribe(console.log)
    // range(1, 10)
    //   .pipe(
    //     delayWhen(n => {
    //       console.log(n)
    //       return timer(n * 1000)
    //     })
    //   )
    //   .subscribe(console.log)
    // take  takeWhile  takeUtil  : 拿前面几个元素，不要后面的
    // skip skipWhile skipUtil  ： 跳过几个元素，获取后面的
    // last
    // interval(1000).pipe(take(5), last()).subscribe(console.log)
    // concatAll: 有时 Observable 发出的又是一个 Obervable，concatAll 的作用就是将新的可观察对象和数据源进行合并
    // concatMap: 返回一个observable数组
    // fromEvent(document, 'click')
    //   .pipe(
    //     map(event => interval(1000).pipe(take(2))),
    //     concatAll()
    //   )
    //   .subscribe(console.log)
    // interval(1000)
    //   .pipe(
    //     map(val => of(val + 10)),
    //     concatAll()
    //   )
    //   .subscribe(console.log)
    // const clicks = fromEvent(document, 'click')
    // const result = clicks.pipe(concatMap(ev => interval(1000).pipe(take(4))))
    // result.subscribe(x => console.log(x))
    // reduce：对数数据进行累计操作。reduce 会等待数据源中的数据流发送完成后再执行，
    // scan : 类似reduce，但执行时机不同，数据源每次发出数据流 scan 都会执行
    // mergeAll
    // fromEvent(document, 'click')
    //   .pipe(
    //     map(() => interval(1000)),
    //     mergeAll()
    //   )
    //   .subscribe(console.log)
    /**
     * map: 对发出的数据进行简单的处理（转换）（单个观察对象）
     * mergeAll：对前面的一个或多个观察对象 合并输出
     * mergeMap：交叉合并可观察对象  以后  对可观察对象发出的数据流进行转换。
     *  */
    // map
    // of('a', 'b', 'c')
    // .pipe(map(i => 'jty' + i))
    //   .subscribe(x => console.log(x))
    // mergeAll
    // of('a', 'b', 'c')
    //   .pipe(
    //     map(x => interval(5000).pipe(map(i => x + i))),
    //     mergeAll()
    //   )
    //   .subscribe(x => console.log(x))
    // mergeMap
    // of('a', 'b', 'c')
    //   .pipe(mergeMap(x => interval(5000).pipe(map(i => x + i))))
    //   // .pipe(mergeMap(x => interval(5000)))
    //   .subscribe(x => console.log(x))
    // throttleTime : 节流
    // fromEvent(document, 'click')
    //   .pipe(throttleTime(2000))
    //   .subscribe(x => console.log(x))
    // debounceTime ： 防抖
    // fromEvent(document, 'click')
    //   .pipe(debounceTime(1000))
    //   .subscribe(x => console.log(x))
    // distinctUntilChanged ： 检测这次数据流和上次是否一样，一样就去掉
    // of(1, 1, 2, 2, 2, 1, 1, 2, 3, 3, 4)
    //   .pipe(distinctUntilChanged())
    //   .subscribe(x => console.log(x)) // 1, 2, 1, 2, 3, 4
    // groupBy : 分组
    // of({ name: 'Sue', age: 25 }, { name: 'Joe', age: 30 }, { name: 'Frank', age: 25 }, { name: 'Sarah', age: 35 })
    //   .pipe(
    //     groupBy(person => person.age),
    //     mergeMap(group => group.pipe(toArray()))
    //   )
    //   .subscribe(console.log)
    // switchMap  : 切换到下一个订阅源
    // fromEvent(document, 'click')
    //   .pipe(switchMap(ev => interval(1000)))
    //   .subscribe(x => console.log(x))
  }

  // 状态管理
  up(num?) {
    num ? this.store.dispatch(increment_num({ num })) : this.store.dispatch(increment())
  }
  upAsync(num) {
    this.store.dispatch(increment_async({ num }))
  }
  down(num?) {
    num ? this.store.dispatch(decrement_num({ num })) : this.store.dispatch(decrement())
  }
}
